const $girl = document.querySelector('.girl'),
	$bird = document.querySelector('.bird-wrap'),
	$btn = document.querySelector('.right-arrow'),
	$audio = document.querySelector('audio'),
	$stage = document.querySelector('.stage'),
	$paper = document.querySelector('.paper'),
	textArray = [
		"",
		"可莉知道，今天是陈纯姐姐的生日，可以陪姐姐过生日，可莉很开心！",
		"可莉特意定制了这个生日蛋糕送给姐姐。你，你放心，可莉才没有在里面放嘟嘟可。",
		"可莉听旅行者哥哥说，姐姐年底要参加什么考核，这是你们大人的事情，可莉不懂。",
		"但我知道，姐姐一定会成功！就像可莉能成功成为西风骑士团，「火花骑士」那样！",
		"所以，所以可莉决定，今年年底前会和姐姐一起努力，明年就可以和哥哥姐姐一起去炸鱼，呃...，是去冒险！",
		"总之，可莉祝姐姐生日快乐，希望每一天都可以看见姐姐开心的样子，像可莉一样总是遇到好人，总是有好运！"
	]


let step = 0

// 按钮事件
$btn.addEventListener('click', e => {
	if (!$audio.paused) return

	step++


	switch (step) {
		case 1:
			// 女孩
			$girl.classList.add('walking')
			$girl.style.right = '40%'
			$girl.style.transform = 'translateX(60%) scale(0.9)'

			// 鸟
			$bird.classList.add('fly')
			break;

		case 2:
			// 舞台
			$stage.classList.add('blur')

			break;
		default:
			break;
	}


	const count = Number($audio.src.match(/\/(\d)\.mp3/)?.[1] || 0)
	console.log('count', count)
	if (count < 6 && count !== 1) {
		$audio.play()
	}
})

// 女孩事件
$girl.addEventListener('transitionend', e => {
	const act = $girl.classList.contains('walking') ? 'remove' : 'add'
	$girl.classList[act]('walking')
})

// 音频事件
$audio.addEventListener('ended', e => {
	const count = Number($audio.src.match(/\/(\d)\.mp3/)?.[1] || 0)
	console.log('ended count', count)
	console.log('next count', count + 1)
	$audio.src = `./voice/${count + 1}.mp3`

	// 女孩停止走动
	$girl.classList.contains('walking') && $girl.classList.remove('walking')
})

// 纸事件
$paper.addEventListener('transitionend', e => {
	setTimeout(() => {
		const count = Number($audio.src.match(/\/(\d)\.mp3/)?.[1] || 0)
		$paper.innerText = textArray[count]
		$audio.play()
	}, 500)
})

window.addEventListener('load', () => {
	$btn.classList.remove('hide')
})