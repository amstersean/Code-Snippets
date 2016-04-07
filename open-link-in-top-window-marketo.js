<script >
MktoForms2.whenReady(function (form) {
    var form = MktoForms2.getForm(1690); //the 1690 is the form id - need to inspect the page in order to find this out
    form.onSuccess(function (values, followUpUrl)
    { window.top.location.href = followUpUrl; return false;
    });
});
</script>
