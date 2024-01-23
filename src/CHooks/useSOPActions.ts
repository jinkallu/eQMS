import { useState } from "react";
import { getPullRequestStatus } from "../utils/gitHelpers";

const useSOPActions = () => {
  const [canEdit, setCanEdit] = useState(false);
  const [myApprovalPending, setMyApprovalPending] = useState<{
    hasPrivilege: Boolean;
    isPending: Boolean;
  }>({ hasPrivilege: false, isPending: false });
  const [myReviewPending, setMyReviewPending] = useState<{
    hasPrivilege: Boolean;
    isPending: Boolean;
  }>({ hasPrivilege: false, isPending: false });
  const [pullRequestStatus, setPullRequestStatus] = useState([]);
  const getActions = async ({
    sop,
    teamsWithMembers,
    currentUser,
    projectId,
    repositoryId,
  }) => {
    sop?.author?.map((author) => {
      const member = teamsWithMembers
        ?.find((item) => item.id === author)
        ?.members?.find((item) => item?.identity?.id === currentUser?.id);
      if (member) {
        setCanEdit(true);
      }
      return author;
    });
    let pullRequestStatusData = [];
    if (sop?.pullRequest) {
      pullRequestStatusData = await getPullRequestStatus(
        projectId,
        repositoryId,
        sop?.pullRequest?.pullRequestId
      );
    }

    setPullRequestStatus(pullRequestStatusData);

    let isReviewer =
      pullRequestStatusData?.filter(
        (item) =>
          item?.context?.name === currentUser?.id &&
          item?.context?.genre === "Reviewer"
      )?.length > 0;

    let isApprover =
      pullRequestStatusData?.filter(
        (item) =>
          item?.context?.name === currentUser?.id &&
          item?.context?.genre === "Approver"
      )?.length > 0;

    const canReview = sop?.pullRequest?.reviewers?.find(
      (item) => item.id === currentUser.id && item?.vote === 0 && isReviewer
    );
    const isReviewPending = pullRequestStatusData?.some(
      (item) =>
        item?.context?.genre === "Reviewer" &&
        sop?.pullRequest?.reviewers?.filter(
          (rev) => rev?.id === item?.context?.name && rev?.vote === 0
        )?.length > 0
    );

    const isApprovePending = pullRequestStatusData?.some(
      (item) =>
        item?.context?.genre === "Approver" &&
        sop?.pullRequest?.reviewers?.filter(
          (rev) =>
            rev?.id === item?.context?.name &&
            rev?.id === currentUser?.id &&
            rev?.vote === 0
        )?.length > 0
    );

    if (canReview && isReviewer) {
      setMyReviewPending({ hasPrivilege: isReviewer, isPending: true });
    } else {
      setMyReviewPending({ hasPrivilege: isReviewer, isPending: false });
    }

    if (!isReviewPending && isApprovePending) {
      setMyApprovalPending({ hasPrivilege: isApprover, isPending: true });
    } else {
      setMyApprovalPending({ hasPrivilege: isApprover, isPending: false });
    }
  };

  return {
    getActions,
    canEdit,
    myApprovalPending,
    myReviewPending,
    pullRequestStatus,
  };
};

export default useSOPActions;
