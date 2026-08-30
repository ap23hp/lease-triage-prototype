const categories = require('./categories.json');

function triageEnquiry(userText) {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    if (category.subScenarios) {
      for (let j = 0; j < category.subScenarios.length; j++) {
        const subCategory = category.subScenarios[j];
        if (subCategory.keywords.some(keyword => userText.includes(keyword))) {
          return {
            category: category.name,
            nextStep: subCategory.nextStep
          };
        }
      }
    } else {
      if (category.keywords.some(keyword => userText.includes(keyword))) {
        return {
          category: category.name,
          nextStep: category.nextStep
        };
      }
    }
  }
  return null;
}



module.exports = triageEnquiry;