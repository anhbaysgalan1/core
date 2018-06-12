exports.getCurrent = function() {
  const currentHour = new Date().getHours();

  let partOfDay = "MORNING";

  if (currentHour > 12 && currentHour < 18) {
    partOfDay = "AFTERNOON";
  } else if (currentHour > 18 || currentHour < 5) {
    partOfDay = "EVENING";
  }
  
  return partOfDay;
}

