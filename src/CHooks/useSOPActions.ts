import { useState } from "react";
import { getPullRequestStatus } from "../utils/gitHelpers";

const useSOPActions = () => {
  const [canEdit, setCanEdit] = useState(false);
  const [myApprovalPending, setMyApprovalPending] = useState(false);
  const [myReviewPending, setMyReviewPending] = useState(false);
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

    const canReview = sop?.pullRequest?.reviewers?.find(
      (item) => item.id === currentUser.id && item?.vote === 0 && isReviewer
    );
    console.log(pullRequestStatusData);
    const isReviewPending = pullRequestStatusData?.some(
      (item) =>
        item?.context?.genre === "Reviewer" &&
        sop?.pullRequest?.reviewers?.filter(
          (rev) => rev?.id === item?.name && item?.vote === 0
        )?.length > 0
    );

    // pullRequestStatusData
    //   ?.filter((item) => item?.context?.genre === "Reviewer")
    //   ?.filter(
    //     (item) =>
    //       sop?.pullRequest?.reviewers?.filter(
    //         (rev) => rev?.id === item?.name && item?.vote === 0
    //       )?.length > 0
    //   )?.length > 0;

    console.log(pullRequestStatusData, isReviewPending);

    if (canReview && isReviewer) {
      setMyReviewPending(true);
    } else {
      setMyReviewPending(false);
    }

    if (
      sop?.pullRequest?.reviewers?.find(
        (item) => item.id === currentUser.id && item?.vote === 0
      )
    ) {
      if (!canReview && !isReviewPending) {
        setMyApprovalPending(true);
      } else {
        setMyApprovalPending(false);
      }
    } else {
      setMyApprovalPending(false);
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
