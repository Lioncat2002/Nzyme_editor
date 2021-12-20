const firebaseConfig = {
    apiKey: "AIzaSyCm-w360K49K59PJir4yWj3uQ7mTEx2_6o",
    authDomain: "pastio-code.firebaseapp.com",
    projectId: "pastio-code",
    storageBucket: "pastio-code.appspot.com",
    messagingSenderId: "601913400286",
    appId: "1:601913400286:web:c46c11195caceb9e209b4f",
    measurementId: "G-F8909KM98V",
    databaseURL:"https://pastio-code-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


var editor = CodeMirror.fromTextArea(document.getElementById("area"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
    
  });
 
  editor.setOption("theme","dracula")
  
  //Check for shared code
  function checkForCode(){
    const params=new URL(window.location.href)

    var dbid=params.searchParams.get("query")
    
    var ref = firebase.database().ref();
    var txt=''
    var lang=''
    ref.on("value", function(snapshot) {
        console.log(snapshot.val()[dbid]["query"])
     txt=snapshot.val()[dbid]["query"]
     lang=snapshot.val()[dbid]["lang"]

     document.getElementById("lang").value=parseInt(lang)
     editor.getDoc().setValue(txt?window.atob(txt):'');
     

  }, function (error) {
     console.log("Error: " + error.code);
  });
    
  }

  //Sharing function
  function share(){
    var s=editor.getValue()
    const urlParams = new URLSearchParams(window.location.search);

    var dbid=Math.round(new Date().getTime()/1000)+" "
    
    firebase.database().ref(dbid).set({
        query:window.btoa(s),
        lang:document.getElementById("lang").value
    })
    urlParams.set('query', dbid);
    
    document.getElementById('url').value=window.location.origin+window.location.pathname+'?'+urlParams
    
    navigator.clipboard.writeText(window.location.origin+window.location.pathname+'?'+urlParams)
    alert("Copied to clipboard")
    }

//Code execution stuff
  function check(){
    document.getElementById("console").innerText=""
    let lang=document.getElementById("lang").value
    let compiler=''
    switch (lang) {
        case "0":
            compiler="cg63"
            break;
        case "1":
            compiler="g82"
            break
        case "2":
            compiler="python310"
            
            break
        case "3":
            compiler="gfortran94"
            break
        
        default:
       
            break;
    }
    let data={
        "source": editor.getValue(),
        "compiler": compiler,
        "options": {
            "userArguments": "-O3",
            "executeParameters": {
                "args": ["arg1", "arg2"],
                "stdin": document.getElementById("stdin").value,
            },
            "compilerOptions": {
                "executorRequest": true
            },
            "filters": {
                "execute": true
            },
            "tools": [],
            "libraries": [
                {"id": "openssl", "version": "111c"}
            ]
        },
        "allowStoreCodeDebug": true
        }

        if(lang!=-1){
            fetch(
            `https://gcc.godbolt.org/api/compiler/${compiler}/compile`,
        {
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            method:"POST",
            body:JSON.stringify(data)
        }
        ).then((res)=>
            res.json()
        )
        .then((data)=>{
            console.log(data)
            if(data.code==0)
            {
                for(var i=0;i<data.stdout.length;i++)
                {
                    document.getElementById("console").innerText+=`${data.stdout[i].text}\n`
                }
            }
            else 
            {
                if(data.buildResult.stderr){
                    for(var i=0;i<data.buildResult.stderr.length;i++)
                    {
                        document.getElementById("console").innerText+=`${data.buildResult.stderr[i].text}\n`
                    }
                }else{
                        for(var i=0;i<data.stderr.length;i++)
                        {
                            document.getElementById("console").innerText+=`${data.stderr[i].text}\n`
                        }
                    }
            
            
                
            }})
        }

  }