const addCampaignBtn = document.getElementById('add-campaign');
const popup = document.getElementById('overlay');
const btnClose = document.getElementById('btn-close');
const homepage = document.querySelector('.campaign_home');

// function that opens modal on click
function openModal() {
	homepage.classList.add('popup-open');
	popup.style.display = 'block';
}

function closeModal() {
	popup.style.display = 'none';
	homepage.classList.remove('popup-open');
}

//Event listeners
addCampaignBtn.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);
