const categories = require('./categories.json');
function triageEnquiry(userText) {
  const matches = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    if (category.subScenarios) {
      for (let j = 0; j < category.subScenarios.length; j++) {
        const subCategory = category.subScenarios[j];
        if (
          subCategory.keywords.some((keyword) => userText.includes(keyword))
        ) {
          matches.push({
            category: category.name,
            nextStep: subCategory.nextStep,
            explanation: category.explanation,
          });
        }
      }
    } else {
      if (category.keywords.some((keyword) => userText.includes(keyword))) {
        matches.push({
          category: category.name,
          nextStep: category.nextStep,
          explanation: category.explanation,
        });
      }
    }
  }

  if (matches.length === 0) {
    return null;
  }

  return {
    ...matches[0],
    hasMultipleMatches: matches.length > 1,
  };
}

module.exports = triageEnquiry;