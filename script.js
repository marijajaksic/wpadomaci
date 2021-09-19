(function() {
    const VAPID_KEY = 'BIjLwvb6J97zEoMZTf6aYvIUcZkXKnF_Rc3B4pHHbAh3rkq91ellcJL-CkuiJPnI0GjLK24435o7HiGT-o1XGvs'
    const BACK_URL = 'http://localhost:5501'

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("sw.js", { scope: '.' }).then(register => {
            console.log("service worker successfully")
            if ("Notification" in window) {
                Notification.requestPermission(result => {
                    if (result == 'granted') {
                        console.log('granded :)')
                        register.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(VAPID_KEY)
                        }).then(subsciption => {
                            fetch(BACK_URL + '/subscribe', {
                                method: "POST",
                                body: JSON.stringify(subsciption),
                                headers: {
                                    "content-type": "application/json"
                                }
                            })
                        })
                    }
                })
            }
        })
    }

    window.addEventListener('offline', e => {
        console.log("offline");
        alert("You are offline.")
    });
    window.addEventListener('online', e => { console.log("online") });


})();