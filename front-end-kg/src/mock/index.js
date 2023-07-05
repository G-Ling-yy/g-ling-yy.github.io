import Mock from "mockjs";
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据

let articles = [];
let cameraData = [];
for (let i = 0; i < 100; i++) {
  let newArticleObject = {
    id: Mock.Random.guid(),
    number: Math.random().toFixed(2),
    province: Random.province(),
    organizationName: Random.csentence(5, 10), //  Random.csentence( min, max )
    cameraName: Random.csentence(3, 5), //摄像机名称
    reload: Random.city(),
    thumbnail_pic_s: Random.dataImage("300x250", "mock的图片"), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
    upCloud: Random.csentence(3, 5), //上云网关
    state: Random.csentence(2), //状态
  };
  articles.push(newArticleObject);
}

// 主要是获取传递过来的页码和每页的条数
const param2Obj = (url) => {
  const search = url.split("?")[1];
  //   console.log(search, "djiis");
  if (!search) {
    return {};
  }
  let page = JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  return page;
};
// 数据的获取和删除操作
let cameraDatalist = function(options) {
  console.log(options, "hao");
  let rType = options.type.toLowerCase(); //获取请求的类型并转换为小写
  switch (rType) {
    case "get":
      const { pageSize = 10, currentPage = 1 } = param2Obj(options.url);
      cameraData = articles.filter((item, index) => {
        return (
          index >= (currentPage - 1) * pageSize &&
          index < currentPage * pageSize
        );
      });
      break;
    case "post":
      let id = JSON.parse(options.body).id; // 获取请求的id，将options.body转换为JSON对象
      articles = cameraData = articles.filter(function(val) {
        return val.id != id; // 过滤掉前台传过来的id对应的相应数据，并重新返回
      });
      break;
    default:
      break;
  }
  return {
    code: 200,
    data: {
      total: articles.length,
      cameraData: cameraData,
    },
  };
};
// Mock.mock("/mock/cameraData/list", /get|post/i, cameraDatalist);
Mock.mock(RegExp("/mock/cameraData/list" + ".*"), /get|post/i, cameraDatalist);

// 数据的添加操作
let listAdd = function(options) {
  console.log("传过来的数据" + JSON.parse(options.body).params.obj);
  let obj = JSON.parse(options.body).params.obj;
  // console.log("数据获取"+ obj);
  articles = articles.concat(obj); // 将前台返回来的数据，拼接到数组中。
  return {
    data: articles,
  };
};
Mock.mock("/mock/cameraData/listAdd", /get|post/i, listAdd);

// 数据的修改操作
let listUpdate = function(options) {
  let obj = JSON.parse(options.body).params.obj;
  // console.log(JSON.parse(options.body).params);
  // let id = parseInt(JSON.parse(options.body).params.obj.id);
  articles = articles.map((val) => {
    // 将需要替换的数据替换掉
    // console.log(val)
    return val.id == obj.id ? obj : val;
  });
  return {
    data: articles,
  };
};
// Mock.mock("/mock/cameraData/listUpdate", /get|post/i, listUpdate);
Mock.mock(RegExp("/mock/cameraData/listUpdate" + ".*"), /post/i, listUpdate);


