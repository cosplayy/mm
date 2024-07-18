document.addEventListener('DOMContentLoaded', function () {
  const dataContainer = document.getElementById('data');
  const autoRefreshToggle = document.getElementById('autoRefreshToggle');
  let autoRefreshInterval = null;

  const loadData = () => {
      dataContainer.innerHTML = '<p class="loading">Loading...</p>';

      fetch('https://pag.gg/1120/api/64157')
          .then(response => response.json())
          .then(data => {
              console.log('API Response:', data); // Log the API response to the console

              dataContainer.innerHTML = '';

              // Create Spotify URL
              const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(data.song)}`;

              // Create elements to display song, outputWords, and artist
              const songElement = document.createElement('div');
              songElement.className = 'item';
              songElement.innerHTML = `<p>Song: <a href="${spotifyUrl}" target="_blank">${data.song}</a></p>`;
              dataContainer.appendChild(songElement);

              const outputWordsElement = document.createElement('div');
              outputWordsElement.className = 'item';
              outputWordsElement.innerHTML = `<p>Output Words: ${data.outputWords} <button id="copyButton">Copy</button></p>`;
              dataContainer.appendChild(outputWordsElement);

              const artistElement = document.createElement('div');
              artistElement.className = 'item';
              artistElement.innerHTML = `<p>Artist: ${data.artist}</p>`;
              dataContainer.appendChild(artistElement);

              // Copy to clipboard functionality
              document.getElementById('copyButton').addEventListener('click', function () {
                  navigator.clipboard.writeText(data.outputWords)
                      .then(() => alert('Output Words copied to clipboard'))
                      .catch(err => console.error('Failed to copy text: ', err));
              });

              // Prompt to install app
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                  // Prevent the mini-infobar from appearing on mobile
                  e.preventDefault();
                  // Stash the event so it can be triggered later.
                  deferredPrompt = e;
                  // Update UI notify the user they can install the PWA
                  const installButton = document.createElement('button');
                  installButton.innerText = 'Install App';
                  installButton.addEventListener('click', () => {
                      // Show the install prompt
                      deferredPrompt.prompt();
                      // Wait for the user to respond to the prompt
                      deferredPrompt.userChoice.then((choiceResult) => {
                          if (choiceResult.outcome === 'accepted') {
                              console.log('User accepted the install prompt');
                          } else {
                              console.log('User dismissed the install prompt');
                          }
                          deferredPrompt = null;
                      });
                  });
                  dataContainer.appendChild(installButton);
              });
          })
          .catch(error => {
              console.error('Error fetching data:', error);
              dataContainer.innerHTML = '<p class="error">Failed to load data.</p>';
          });
  };

  // Initial load
  loadData();

  // Toggle auto-refresh
  autoRefreshToggle.addEventListener('change', function () {
      if (this.checked) {
          autoRefreshInterval = setInterval(loadData, 10000); // Adjust interval as needed
      } else {
          clearInterval(autoRefreshInterval);
      }
  });
});
