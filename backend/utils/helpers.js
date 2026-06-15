const getFileType = (mimetype) => {
  if (mimetype === 'application/pdf') return 'pdf';
  if (
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return 'ppt';
  }
  return null;
};

const isWithinCheckInWindow = (scheduledAt, windowMinutes) => {
  const now = new Date();
  const sessionStart = new Date(scheduledAt);
  const windowEnd = new Date(sessionStart.getTime() + windowMinutes * 60 * 1000);
  return now >= sessionStart && now <= windowEnd;
};

module.exports = { getFileType, isWithinCheckInWindow };
