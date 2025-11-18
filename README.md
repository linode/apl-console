# Akamai App Platform Console

A React-based frontend for the Akamai App Platform that provides a web interface for managing containerized applications, teams, services, and platform resources. Built with TypeScript and Material-UI.

## Key Features

- **Team Management**: Create and manage development teams with resource quotas
- **Platform App Management**: One click deployment of popular platform apps
- **Catalog Quickstarts**: Quickly deploy applications with preconfigured templates
- **Application Deployment**: Deploy and manage containerized applications
- **Service Configuration**: Configure services, load balancers and ingress
- **Container Image Builds**: Build and manage container images
- **Code Repository Integration**: Git repository management and CI/CD
- **Network Policies**: Configure ingress/egress network security policies
- **Secret Management**: Create and manage Kubernetes secrets
- **User Management**: Role-based access control (RBAC)
- **Policy Management**: Security and compliance policies
- **Workload Management**: Kubernetes workload oversight

### Prerequisites

- Node.js ≥20 <21
- npm
- nvm (highly recommended for `nvm use`)
- Running instance of [Akamai App Platform API](https://github.com/linode/apl-api) (see #Development Setup)
- Running instance of [Akamai App Platform Core](https://github.com/linode/apl-core) (see #Development Setup)

### Development Setup

1. **Install dependencies**

   ```bash
   npm install
   # or use the Makefile
   make install

   ```

2. **Run Akamai App Platform Core**

   - Follow instructions to set up Core at [Akamai App Platform Core](https://github.com/linode/apl-core)
   - cd to the Core folder
   - run `npm run server`

3. **Run Akamai App Platform Api**

   - Follow instructions to set up API at [Akamai App Platform API](https://github.com/linode/apl-api)
   - cd to the API folder
   - run `npm run dev`

4. **Start Akamai App Platform Console**
   ```bash
   npm run dev
   # or
   make dev
   ```
   This starts the React app with TypeScript watching and opens Chrome with debugging enabled.
5. **Access the application**
   - http://localhost:3000

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Route-specific page components
│   ├── builds/        # Container image build management
│   ├── code-repositories/  # Git repository management
│   ├── network-policies/   # Network security policies
│   ├── secrets/       # Secret management
│   ├── services/      # Service configuration
│   └── teams/         # Team management
├── redux/             # State management (RTK Query)
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── theme/             # Material-UI theme configuration
├── utils/             # Utility functions
└── i18n/              # Internationalization
```

## Available Scripts

### Development

- `npm run dev` / `make dev` - Start development server with debugging
- `npm start` / `make start` - Start React development server only
- `npm run dev:docker` / `make docker` - Run development in Docker

### Testing & Quality

- `npm test` / `make test` - Run tests once
- `npm run lint` / `make lint` - Run ESLint with TypeScript checking
- `npm run format` - Check code formatting with Prettier
- `npm run format:fix` - Fix code formatting automatically

### Build & Production

- `npm run build` / `make build` - Build for production
- `npm run types` - TypeScript type checking only
- `npm run watch:ts` - TypeScript watching mode

### API & Codegen

- `npm run gen:store` / `make gen-store` - Generate RTK Query API clients from OpenAPI

## Technology Stack

- **Frontend**: React 18, TypeScript, Material-UI v5
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v5
- **Styling**: Emotion, Material-UI theming
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Forms**: React Hook Form with Yup validation

## API Integration

The console communicates with the APL API using auto-generated clients via RTK Query. To regenerate API clients when the API schema changes:

```bash
npm run gen:store
```

## Browser Support

Supports modern browsers (>0.2% usage, not IE11 or Opera Mini).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

Licensed under Apache License, Version 2.0. See [LICENSE.md](LICENSE.md).
