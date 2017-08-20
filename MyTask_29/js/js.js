(function(){
  let $userid = $('#search-input');
  let timer;
  let currentreq;
  let data = {
    client_id:`b7fbf31c2286d8b19063`,
    client_secret:`0001ec57cc1d0681b4603ec2a2bbdd661ee24c18`
  }
  $userid.on('keyup',function(){
    clearTimeout(timer);
    if ($(this).val().length === 0) return $('main').html('');
      timer = setTimeout(async ()=>{
        if (currentreq) currentreq.abort();
        try {
          currentreq = $.ajax({url:`https://api.github.com/users/${$userid.val()}`,data});
          let res = await currentreq;
          render(res);
          } 
        catch(e) {
          console.log('Error: '+e.message);
          alert('查无此ID信息，请重新输入！');
          $('main').html('');
        }
      },700);
    });
  function render(res){
    $('main').html(`
      <div class="userinfo">
        <img src="${res.avatar_url}">
        <div>
          <p>ID: ${res.id}</p>
          <p>用户名: <a href="${res.html_url}" target="_blank">${res.login}</a></p>
          <p>昵称: ${res.name}</p>
          <p>email: ${res.email}</p>
        </div>
      </div>
      <div class="otherinfo">
        <p>Followers Count: ${res.followers}</p>
        <p>Following Count: ${res.following}</p>
        <p>Repos Count: ${res.public_repos}</p>
        <p>Create Time: ${res.created_at}</p>
        <p>Update Time: ${res.updated_at}</p>
      </div>
      <div class="reposinfo"></div>
    `);
    (async function(res){
      let repos = await (await fetch(res.repos_url)).json();
      let reposinfo = '<h2><i class="fa fa-list" style="margin:0 1rem;"></i>仓库列表：</h2>';
      repos.map(item=>{
        reposinfo += `
        <p><i class="fa fa-book" aria-hidden="true"></i><a href="${item.html_url}" target="_blank">${item.name}</a><span class="star-count">${item.stargazers_count}</span><i class="fa fa-star" aria-hidden="true"></i></p>`;
      });
      $('.reposinfo').html(reposinfo);
    })(res)
  };
  document.addEventListener('DOMContentLoaded',function(){
    $('main').on('click','.fa.fa-list',function(){
        $('.reposinfo p').toggleClass('height0');
    })
  })
})()