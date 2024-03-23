
const models = require("../models")

async function getCountries() {
  return await models.country.findAll({ attributes: ['id', 'name'] });
}

async function getStatesByCountry(countryId) {
  return await models.state.findAll({
    where: { countryId: countryId },
    attributes: ['id', 'name'],
    include: [{ model: models.country,as:"country", attributes: [] }], 
  });
}

async function getCitiesByState(stateId) {
  return await City.findAll({
    where: { StateId: stateId },
    attributes: ['id', 'name'],
    include: [{ model: models.state,as:"state", attributes: [] }], 
  });
}

async function getDataBySelection(selectionType, selectionId) {
    switch (selectionType) {
      case 'country':
        return await getStatesByCountry(selectionId);
      case 'state':
        return await getCitiesByState(selectionId);
      case 'city':
        const cityData = await City.findOne({
          where: { id: selectionId },
          include: [{ model: models.state,as:"state", include: [{ model: models.country,as:"country", attributes: ['name'] }] }],
        });
        return cityData ? cityData.toJSON() : null;
      default:
        return null;
    }
  }

module.exports = { getCountries, getStatesByCountry, getCitiesByState, getDataBySelection };
