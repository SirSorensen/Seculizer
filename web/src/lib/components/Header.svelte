<script lang="ts">
  import Logo from "$lib/assets/logo.png";
</script>

<header>
  <a href="/"><img src={Logo} alt="" /></a>
</header>

<style>
  header {
    width: 100%;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eeeeee;
  }

  a {
    height: 90%;
  }
  a img {
    height: 100%;
  }
</style>
