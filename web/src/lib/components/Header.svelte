<script lang="ts">
  import Logo from "$lib/assets/logo.png";
</script>

<header>
  <a data-sveltekit-reload href="/"><img src={Logo} alt="" /></a>
</header>

<style>
  header {
    width: 100%;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--header-bg);
  }

  a {
    height: 90%;
  }
  a img {
    height: 100%;
  }
</style>
