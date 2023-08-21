import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient, WebApiTeam } from "azure-devops-extension-api/Core";
import { Identity } from "azure-devops-extension-api/Identities/Identities";

const useGetTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getProjectTeams = async (projectId) => {
    try {
      const coreClient = getClient(CoreRestClient);
      const teams = await coreClient.getTeams(projectId);
      return teams;
    } catch (e) {
      return null;
    }
  };

  const getTeamMembers = async (project_name: string, team_name: string) => {
    try {
      const coreClient = getClient(CoreRestClient);
      const project = await coreClient.getProject(project_name);
      const identityData: Identity = {
        customDisplayName: "",
        descriptor: { identifier: "testteam2", identityType: "windows" },
        isActive: true,
        isContainer: false,
        masterId: null,
        memberIds: [],
        memberOf: null,
        members: null,
        metaTypeId: null,
        properties: null,
        providerDisplayName: null,
        resourceVersion: null,
        socialDescriptor: null,
        subjectDescriptor: null,
        uniqueUserId: null,
        id: null,
      };
      console.log(project.id, project.name);
      const webTeamsData: WebApiTeam = {
        description: "test team",
        identity: identityData,
        projectId: project.id,
        projectName: project.name,
        identityUrl: null,
        id: null,
        name: "testeam1",
        url: "",
      };
      const teamCreated = await coreClient.createTeam(webTeamsData, project.id);
      console.log(teamCreated);
      console.log(project);
      const team = await coreClient.getTeam(project!.id, team_name);
      const members = await coreClient.getTeamMembersWithExtendedProperties(
        "7074388e-e3e3-4296-83e1-0c0a107c7b66",
        "318d0824-55a0-45e1-b24a-25f15d399948"
      );

      const projects = await coreClient.getProjects();
      console.log(projects?.filter((data) => data.id === project.id));
      const userNames = members.map((member) => member.identity.displayName);
      setTeamMembers(userNames);
      console.log(userNames);
      return userNames;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getTeamMembers, getProjectTeams };
};

export default useGetTeamMembers;
