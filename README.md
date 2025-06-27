# eQMS

eQMS is an extension for Azure DevOps designed to streamline and automate Quality Management System (QMS) processes within your DevOps organization. It provides tools for project initialization, repository management, team setup, documentation, and feature toggling — all seamlessly integrated with Azure DevOps.

## Features

- **Project Management**: Create and verify Azure DevOps projects programmatically.
- **Repository Initialization**: Auto-initialize repositories with default branches and README files.
- **Team Management**: Retrieve and manage teams and their members.
- **Feature Management**: Enable or disable Azure DevOps features for projects.
- **Wiki Support**: Create and manage project wikis for collaborative documentation.
- **Pull Request Review**: Retrieve and handle reviewer information for pull requests.

## Getting Started

### Prerequisites

- Azure DevOps account and organization
- Node.js (latest LTS recommended)
- Yarn or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jinkallu/eQMS.git
   cd eQMS
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your Azure DevOps credentials and endpoints as required.

### Running the Extension

```bash
npm start
# or
yarn start
```

Visit your local server URL (e.g., http://localhost:3000) to interact with the extension.

## Build and Test

To build the extension:

```bash
npm run build
# or
yarn build
```

To run tests:

```bash
npm test
# or
yarn test
```

## Usage

- **Create Projects**: Launch new Azure DevOps projects with custom process templates.
- **Manage Teams**: Add or remove team members, view teams, and manage their roles.
- **Initialize Repositories**: Automatically set up repositories with the preferred branch structure.
- **Wiki Management**: Create and update project wikis for your QMS documentation.
- **Feature Toggle**: Enable or disable Azure DevOps features (Boards, Pipelines, etc.) as needed.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit and push your changes.
4. Open a pull request describing your changes.

## License

_No license specified yet. Please open an issue if clarification is needed._

## Acknowledgments

- [Azure DevOps Extension SDK](https://github.com/microsoft/azure-devops-extension-sdk)
- [React](https://react.dev/)
- [Azure DevOps Docs: Create a Readme](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops)

---

> _This extension is actively developed. See the code and inline comments for more details._
