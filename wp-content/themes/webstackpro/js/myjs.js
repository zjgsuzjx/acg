

swal({
    title: "【5.4重要提醒⚠️】",
    text: "1. 由于域名过期，本站已迁移至新域名：https://myacg.pro\n" +
          "2. 最近会进行一次大更新\n" +
          "3. 过去由于个人原因近一年未更新，谢谢仍然关注本站的朋友们！\n" +
            "该提示框每天仅显示一次，感谢大家的支持！",
    button: "【OK】点击屏幕任意处关闭",
    icon: "success",
  }); function AddFavorite(title, url) {

    try {

        window.external.addFavorite(url, title);

    }

    catch (e) {

        try {

            window.sidebar.addPanel(title, url,);

        }

        catch (e) {

            alert("抱歉，您所使用的浏览器无法完成此操作。");

        }

    }

}

