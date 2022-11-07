const $girl = document.querySelector('.girl'),
	$btn = document.querySelector('.right-arrow')

let right = 0

// 按钮事件
$btn.addEventListener('click', e => {
	const act = $girl.classList.contains('walking') ? 'remove' : 'add'
	$girl.classList[act]('walking')

	// 若 走步
	if (act === 'add') {
		$girl.style.right = `${right += 16}%`

		// 隐藏按钮
		// $btn.style.visibility = 'hidden'
	}
})

// 女孩事件
$girl.addEventListener('transitionend', e => {
	const act = $girl.classList.contains('walking') ? 'remove' : 'add'
	$girl.classList[act]('walking')
})