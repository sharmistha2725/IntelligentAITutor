# Adaptive Learning Platform

A personalized learning experience that adapts to individual learning styles and knowledge levels.

## Overview

This platform leverages AI to customize educational content based on how users learn best (visual, auditory, reading/writing, or kinesthetic) and their current knowledge level (basic, intermediate, advanced).

## Features

- *Personalized Learning Experience*
  - Learning style assessment (VARK: Visual, Auditory, Reading, Kinesthetic)
  - Knowledge level categorization
  - Tailored content delivery

- *Authentication System*
  - Google Sign-in integration
  - Email/password registration and login
  - User profile management

- *Subject & Topic Management*
  - Create and explore learning subjects
  - Organize topics within subjects
  - Public/private subject availability

- *AI-Powered Tutoring*
  - Content adaptation based on learning preferences
  - Interactive learning sessions
  - Personalized pace and approach

- *Resource Management*
  - Upload and organize learning materials
  - Integrate resources with AI-guided sessions

- *Assessment System*
  - Initial learning style determination
  - Knowledge testing to establish baseline
  - Progress tracking with periodic assessments

## Tech Stack

- *Frontend*: React, TypeScript, Tailwind CSS, Shadcn UI
- *Backend*: Node.js, Express, TypeScript
- *State Management*: Tanstack Query
- *Routing*: Wouter
- *Database*: SQL with Drizzle ORM
- *Authentication*: Google OAuth, JWT

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

git clone <repository-url>


2. Install dependencies

npm install


3. Start the development server

npm run dev




## User Flow

1. *Sign Up/Login*: User authenticates via Google or email/password
2. *Learning Style Assessment*: User takes VARK assessment
3. *Subject Selection*: User selects or creates a subject to study
4. *Knowledge Assessment*: Initial test determines baseline knowledge
5. *Personalized Learning*: AI tutor delivers customized content
6. *Progress Tracking*: Periodic assessments gauge understanding
7. *Continuous Adaptation*: System adjusts to user performance

## Unique Value Proposition

This platform stands out by providing truly personalized education that adapts not just to what users need to learn, but how they learn best. Unlike traditional platforms that use a one-size-fits-all approach, our system delivers the same information differently based on individual learning preferences.

## Future Enhancements

- Enhanced AI capabilities with more sophisticated content generation
- Collaboration features for peer learning
- Analytics dashboard with detailed learning insights
- Mobile application for learning on-the-go
- Content marketplace for sharing learning resources
- Integration with educational institutions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
