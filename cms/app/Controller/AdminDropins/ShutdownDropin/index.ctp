<form method="post">
    <label>
        <input type="checkbox" name="shutdown" <?= $siteState['shutdown'] ? 'checked' : ''; ?>>
        <?= __d('admin-shutdowndrop', 'SHUTDOWN'); ?>
    </label>
    <label>
        <?= __d('admin-shutdowndrop', 'SHUTDOWN_MESSAGE'); ?>:
        <textarea name="shutdown-message"><?= $siteState['shutdown-message']; ?></textarea>
    </label>
    <label>
        <?= __d('admin-shutdowndrop', 'SHUTDOWN_ALLOWED_IP'); ?>:
        <input type="text" name="shutdown-allowed-ips"
               value="<?= is_array($siteState['shutdown-allowed-ips']) ? implode(' ', $siteState['shutdown-allowed-ips']) : ''; ?>">
    </label>
    <input type="submit">
</form>
