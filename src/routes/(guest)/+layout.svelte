<div class="guest">
    <div class="card">
        <slot />
    </div>
</div>

<style>
    .guest {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 90%;
        max-width: 450px;
        height: 100vh;
    }

    .card {
        padding: 2rem;
    }
</style>