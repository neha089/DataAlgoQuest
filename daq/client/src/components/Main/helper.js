export const Helper = {
  setHeader: (html) => {
      return `<h3>${html}</h3>`;
  },
  setListWithHtml: (title, items) => {
      return `<h4>${title}</h4><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  }
};
