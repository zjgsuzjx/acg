

swal({
    title: "【6.15-6.17重要更新⚠️】",
    text: "1. 移除了全部的失效链接\n" +
          "2. 添加了新分类目录《轻小说》\n" +
          "3. 收录了大量新网站\n" +
          "4. 删除了不符合本站收录要求的网站\n" +
          "5. 修复了在线人数功能和其它若干bug\n" +
          "6. 🎈已上线站内投稿和意见提交功能(位于网站左下角)\n" +
          "7. 🔧修复了评论区无法登录评论的问题\n" +
          "8. 🔧修复了无法点赞和增加浏览量的问题\n" +
          "9. 更多功能开发中······\n" +
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

