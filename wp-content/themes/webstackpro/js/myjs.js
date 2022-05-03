

swal('【重要更新】\n1.修复部分问题并更新收录\n2.域名已更新请收藏：https://myacg.xyz/\n', '\n\n点击屏幕任意处关闭', 'success'); function AddFavorite(title, url) {

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

