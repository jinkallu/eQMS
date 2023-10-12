import { useState } from "react";

const useSOPActions = () => {
  const [canEdit, setCanEdit] = useState(false);
  const [myApprovalPending, setMyApprovalPending] = useState(false);
  const getActions = ({ sop, teamsWithMembers, currentUser }) => {
    sop?.author?.map((author) => {
      const member = teamsWithMembers
        ?.find((item) => item.id === author)
        ?.members?.find((item) => item?.identity?.id === currentUser?.id);
      if (member) {
        setCanEdit(true);
      }
      return author;
    });

    if (
      sop?.pullRequest?.reviewers?.find(
        (item) => item.id === currentUser.id && item?.vote === 0
      )
    ) {
      setMyApprovalPending(true);
    }
  };

  return { getActions, canEdit, myApprovalPending };
};

export default useSOPActions;
