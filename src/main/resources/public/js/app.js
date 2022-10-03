function lookupWord() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const word = data.get("word");

    const options = {
      method: 'GET',
    };

    document.getElementById('results').innerHTML = `<p>Searching for <em>${word}'</em>...</p>`;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
        .then(response => response.json())
        .then(data => {
          data = {
            word: data[0].word,
            phonetic: data[0].phonetic,
            phonetics: data[0].phonetics,
            meanings: data[0].meanings
          };
          const template = document.getElementById('dictionary-results-template').innerText;
          const compiledFunction = Handlebars.compile(template);
          document.getElementById('results').innerHTML = compiledFunction(data);
        });
  });
}

function removeDuplicates(dictionary, string) {
  var returnList = [];
  for (const [key, value] of Object.entries(dictionary)) {
    for (const [key2, value2] of Object.entries(value)) {
      if (key2 === string) {
        returnList = returnList.concat(value2);
      }
    }
  }
  return [...new Set(returnList)];
}

function lookupSynonyms() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const word = data.get("word");

    const options = {
      method: 'GET',
    };

    document.getElementById('results').innerHTML = `<p>Searching for synonyms of <em>${word}</em>...</p>`;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
        .then(response => response.json())
        .then(data => {
          data = {
            word: data[0].word,
            synonyms: removeDuplicates(data[0].meanings, 'synonyms')
          };
          const template = document.getElementById('synonyms-results-template').innerText;
          const compiledFunction = Handlebars.compile(template);
          document.getElementById('results').innerHTML = compiledFunction(data);
        });
  });
}

function lookupAntonyms() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const word = data.get("word");

    const options = {
      method: 'GET',
    };

    document.getElementById('results').innerHTML = `<p>Searching for antonyms of <em>${word}</em>...</p>`;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, options)
        .then(response => response.json())
        .then(data => {
          data = {
            word: data[0].word,
            antonyms: removeDuplicates(data[0].meanings, 'antonyms')
          };
          const template = document.getElementById('antonyms-results-template').innerText;
          const compiledFunction = Handlebars.compile(template);
          document.getElementById('results').innerHTML = compiledFunction(data);
        });
  });
}

window.addEventListener('load', () => {
  const app = $('#app');

  const dictionaryTemplate = Handlebars.compile($('#dictionary-template').html());
  const synonymsTemplate = Handlebars.compile($('#synonyms-template').html());
  const antonymsTemplate = Handlebars.compile($('#antonyms-template').html());

  const router = new Router({
    mode:'hash',
    root:'index.html',
    page404: (path) => {
      const html = 'Click on a menu item.';
      app.html(html);
    }
  });

  router.add('/dictionary', async () => {
    html = dictionaryTemplate();
    app.html(html);
    lookupWord();
  });

  router.add('/synonyms', async () => {
    html = synonymsTemplate();
    app.html(html);
    lookupSynonyms();
  });

  router.add('/antonyms', async () => {
    html = antonymsTemplate();
    app.html(html);
    lookupAntonyms();
  });

  router.addUriListener();

  $('a').on('click', (event) => {
    event.preventDefault();
    const target = $(event.target);
    const href = target.attr('href');
    const path = href.substring(href.lastIndexOf('/'));
    router.navigateTo(path);
  });

  router.navigateTo('/');
});