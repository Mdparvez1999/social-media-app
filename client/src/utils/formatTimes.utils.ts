export const formatCommentTime = (date: Date) => {
  const commentDate = new Date(date);
  const now = new Date();
  const secondsDifference = Math.floor(
    (now.getTime() - commentDate.getTime()) / 1000
  );

  if (secondsDifference < 60) {
    return `${secondsDifference}s`;
  } else if (secondsDifference < 3600) {
    const minuteDiffrence = Math.floor(secondsDifference / 60);
    return `${minuteDiffrence}m`;
  } else if (secondsDifference < 86400) {
    const hourDifference = Math.floor(secondsDifference / 3600);
    return `${hourDifference}h`;
  } else {
    const dayDifference = Math.floor(secondsDifference / 86400);
    return `${dayDifference}d`;
  }
};
