import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function pdfExport() {
  var mainRight = document.getElementById('mainRight'); //获取dom上的div包裹的内容
  html2canvas(mainRight, {
    allowTaint: true,
    scale: 2, // 提升画面质量，但是会增加文件大小
  }).then(function (canvas) {

    var contentWidth = canvas.width; //画布宽
    var contentHeight = canvas.height; //画布高

    var pageData = canvas.toDataURL('image/jpeg', 1.0); //转换为图片

    var pdfWidth = (contentWidth + 10) / 2 * 0.75;
    var pdfHeight = (contentHeight + 200) / 2 * 0.75; // 500为底部留白

    var imgWidth = pdfWidth;
    var imgHeight = (contentHeight / 2 * 0.75); //内容图片这里不需要留白的距离

    var pdf = new jsPDF('', 'pt', [pdfWidth, pdfHeight]);
    pdf.addImage(pageData, 'jpeg', 0, 0, imgWidth, imgHeight);
    pdf.save('运维报告' + new Date().getTime() + '.pdf'); //下载命名
  });
}

export default {
  pdfExport
}