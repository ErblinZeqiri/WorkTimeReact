export const calculateTimeDifference = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startMilliseconds =
    startHours * 60 * 60 * 1000 + startMinutes * 60 * 1000;
  const endMilliseconds = endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000;

  const differenceMilliseconds = endMilliseconds - startMilliseconds;

  const differenceHours = Math.floor(differenceMilliseconds / (60 * 60 * 1000));
  const differenceMinutes = Math.floor(
    (differenceMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
  );

  return { differenceHours, differenceMinutes };
};


export const groupByMonth = (elements) => {
  const grouped = {};
  elements.forEach(([key, element]) => {
    const date = new Date(element.date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const monthYear = `${month} ${year}`;

    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(element);
  });
  return grouped;
};

export const totalHoursMinutes = (groupedElements) => {
  const totalByMonth = {};
  Object.entries(groupedElements).forEach(([monthYear, elements]) => {
    let totalHours = 0;
    let totalMinutes = 0;
    elements.forEach((element) => {
      const { differenceHours, differenceMinutes } = calculateTimeDifference(
        element.inter_de,
        element.inter_a
      );

      totalHours += differenceHours;
      totalMinutes += differenceMinutes;
    });
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    totalByMonth[monthYear] = { totalHours, totalMinutes };
  });

  return totalByMonth;
};
export const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export const sortedMonths = (groupedElements) => {
  Object.keys(groupedElements).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");

    const aDate = new Date(
      `${aYear}-${months.indexOf(aMonth.toLowerCase()) + 1}-01`
    );
    const bDate = new Date(
      `${bYear}-${months.indexOf(bMonth.toLowerCase()) + 1}-01`
    );

    return bDate - aDate;
  });
};

export const compareMonthToPrevious = (groupedElements) => {
  const totalWorkTime = totalHoursMinutes(groupedElements);
  const month = Object.keys(totalWorkTime).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");

    const aDate = new Date(
      `${aYear}-${months.indexOf(aMonth.toLowerCase()) + 1}-01`
    );
    const bDate = new Date(
      `${bYear}-${months.indexOf(bMonth.toLowerCase()) + 1}-01`
    );

    return aDate - bDate;
  });

  const comparison = {};

  month.forEach((currentMonth, index) => {
    if (index === 0) {
      comparison[currentMonth] = null;
      return;
    }

    const previousMonth = month[index - 1];
    const currentMonthHours =
      totalWorkTime[currentMonth].totalHours +
      totalWorkTime[currentMonth].totalMinutes / 60;
    const previousMonthHours =
      totalWorkTime[previousMonth].totalHours +
      totalWorkTime[previousMonth].totalMinutes / 60;

    const percentageDifference =
      ((currentMonthHours - previousMonthHours) / previousMonthHours) * 100;

    comparison[currentMonth] = percentageDifference;
  });

  return comparison;
};
