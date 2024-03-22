import React, { useEffect, version } from "react";
import { useExtnStore } from "../../../zustand/store";
import useVersion from "../../../CHooks/useVersion";

import { useSearchParams } from "react-router-dom";

export default function VersionTagView({ element, order, id }) {
  const { repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();
  const { versionData, getVersionData, currentEditBranch } = useVersion();

  useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }
    const branchName = searchParams.get("branchName");
    let lastIndex = branchName.lastIndexOf("/main");

    getVersionData(project.id, repository.id, branchName);
  }, [project, repository, searchParams]);

  return (
    <h4>
      Version: <strong>{versionData?.current?.version + 1}_draft </strong>
    </h4>
  );
}
