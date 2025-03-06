import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Resource, Subject, insertResourceSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, FileText, Book, File } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ResourceManagerProps = {
  subject: Subject;
};

const ALLOWED_FILE_TYPES = [
  { value: "pdf", label: "PDF Document" },
  { value: "ppt", label: "PowerPoint Presentation" },
  { value: "doc", label: "Word Document" },
  { value: "book", label: "E-Book" },
  { value: "other", label: "Other Resource" }
];

export default function ResourceManager({ subject }: ResourceManagerProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: [`/api/subjects/${subject.id}/resources`],
  });

  const form = useForm({
    resolver: zodResolver(insertResourceSchema),
    defaultValues: {
      name: "",
      type: "",
      url: "",
      description: "",
      subjectId: subject.id
    }
  });

  const uploadResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      // In a real implementation, we would handle file uploads to a storage service
      // For now, we'll simulate by using the file name as the URL
      const fileUrl = selectedFile ? `uploads/${selectedFile.name}` : data.url;

      const res = await apiRequest("POST", `/api/subjects/${subject.id}/resources`, {
        ...data,
        url: fileUrl
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/subjects/${subject.id}/resources`] });
      toast({
        title: "Resource added",
        description: "The resource was added successfully."
      });
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to add resource",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("name", file.name.split(".")[0]);
      const fileType = file.name.split(".").pop()?.toLowerCase();
      if (fileType && ["pdf", "ppt", "doc"].includes(fileType)) {
        form.setValue("type", fileType);
      }
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText className="w-4 h-4" />;
      case "ppt":
        return <File className="w-4 h-4" />;
      case "book":
        return <Book className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Learning Resources</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Learning Resource</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit((data) => uploadResourceMutation.mutate(data))} 
                className="space-y-4"
              >
                <div className="p-4 border border-dashed rounded-lg text-center">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block p-4 hover:bg-accent rounded-md transition-colors"
                  >
                    {selectedFile ? (
                      <p className="text-sm">{selectedFile.name}</p>
                    ) : (
                      <>
                        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upload PDF, PPT, or Word document
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Resource name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALLOWED_FILE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the resource..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={uploadResourceMutation.isPending}
                >
                  {uploadResourceMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Resource"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources?.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="flex flex-row items-center gap-2">
              {getResourceIcon(resource.type)}
              <CardTitle className="text-base">{resource.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {resource.description}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(resource.url, "_blank")}
              >
                View Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}