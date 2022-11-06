const $girl = document.querySelector('.girl')

$girl.addEventListener('click', e => {

	const act = $girl.classList.contains('walking') ? 'remove' : 'add'
	$girl.classList[act]('walking')
})