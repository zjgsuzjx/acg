

swal('【重要更新】\n1.移除了全部的失效链接\n2.添加了新分类《轻小说》\n3.收录了大量新网站\n4.删除了不符合本站收录要求的网站\n5.修复了在线人数功能和其它bug\n', '\n\n点击屏幕任意处关闭', 'success'); function AddFavorite(title, url) {

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

