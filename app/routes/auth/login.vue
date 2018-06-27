<template>
    <div>
        <h1>Zaloguj się</h1>
        <p><a href="?role=student">Student</a></p>
        <p><a href="?role=teacher">Nauczyciel</a></p>
    </div>
</template>

<script>
/** @namespace views/auth */

export default {
    data: function () {
        return {
            title: ''
        }
    }
}
</script>
