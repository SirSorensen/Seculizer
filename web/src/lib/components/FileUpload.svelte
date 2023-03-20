<script lang="ts">

  export let content: string;
  let files: FileList | undefined = undefined;
  let announcement = { text: "No file selected", isError: false };
  $: if (files) {
    if(files.length == 0) {
      announcement.text = "No file selected";
      announcement.isError = false;
    } else if (files.length > 1) {
      announcement.text = "Only one file can be uploaded at a time";
      announcement.isError = true;
    } else {
      let file = files[0];  
      
      if (!file.name.endsWith(".sepo") && !file.name.endsWith(".txt")) {
        announcement.text = "Unsupported file type";
        announcement.isError = true;
      } else {
        announcement.text = "Uploading...";
        announcement.isError = false;
        const reader = new FileReader();
        reader.addEventListener("progress", function (e) {
          if (e.loaded && e.total) {
            let percentLoaded = (e.loaded / e.total) * 100;
            if (percentLoaded < 100)
              content = ".".repeat(Math.floor(percentLoaded));
          }
        });
        reader.addEventListener("load", function () {
          content = reader.result as string;
          announcement.text = file.name;
          announcement.isError = false;
        });
        reader.readAsText(file);
      }
    }
  }
</script>

<input
  type="file"
  accept=".sepo, .txt"
  multiple
  bind:files
  id="textUpload"
/>
<label for="textUpload">
  <div class="icon">
    <p>+</p>
  </div>
  <div class="labelText">
    <p>Upload a file</p>
    <small>Supported file types: .sepo, .txt</small>
  </div>
  <small class="announcement" class:error={announcement.isError}
    >{announcement.text}</small
  >
</label>

<style>
  #textUpload {
    display: none;
  }
  label {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: rgb(235, 235, 235);
    border: 0.2rem dashed rgb(200, 200, 200);
    padding: 1rem;
    transition: background-color 0.25s;
  }
  label:hover,
  label:focus-within {
    background-color: rgb(210, 209, 209);
    cursor: pointer;
  }
  label .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    background: black;
    width: 2rem;
    height: 2rem;
    line-height: 1.75rem;
    color: white;
    text-align: center;
    vertical-align: top;
    border-radius: 2rem;
  }
  .labelText {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  label p {
    margin: 0;
    font-weight: bold;
  }
  label .announcement {
    position: absolute;
    bottom: 2px;
    right: 5px;
    font-size: 0.75rem;
    color: rgb(150, 150, 150);
  }

  label .announcement.error {
    color: rgb(199, 2, 2);
    font-weight: bold;
  }
</style>
