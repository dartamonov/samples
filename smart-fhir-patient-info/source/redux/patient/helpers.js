import _ from 'lodash';

export const normalizePatient = info => {
  const address = info.address ? info.address.find(item => item.use === "home").text : "Unknown";
  const name = info.name ? info.name.find(item => item.use === "official") : null;
  const fullName = info.name ? _.startCase(_.toLower(`${_.join(name.given, ' ')} ${_.join(name.family, ' ')}`)) : null;

  return {
    fullName,
    gender: _.capitalize(info.gender),
    birthDate: info.birthDate,
    address
  };
};

export const normalizeConditions = conditions => _.map(conditions.entry, condition => {
    return {
      dateRecorded: condition.resource.dateRecorded || null,
      title: condition.resource.code.text
    };
  }
).sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded));

export const sortConditionsBy = ({conditions, sortAttribute, sortUp}) => {
  if (sortAttribute === 'title') {
    return conditions.sort((a, b) => {
      return sortUp ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
  }
  if (sortAttribute === 'date') {
    return conditions.sort((a, b) => {
      const aDate = sortUp ? new Date(a.dateRecorded) : new Date(b.dateRecorded);
      const bDate = sortUp ? new Date(b.dateRecorded) : new Date(a.dateRecorded);

      return aDate - bDate;
    });
  }
  return conditions;
};
