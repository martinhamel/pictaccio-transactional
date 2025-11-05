<style type="text/css"><?php include 'style.inc.css'; ?></style>

<table>
    <tr>
        <th><?= __d('admin-orderdrop', 'TRANSACTION_ID'); ?></th>
        <th><?= __d('admin-orderdrop', 'PAYMENT_MODULE'); ?></th>
        <th><?= __d('admin-orderdrop', 'SUCCESSFUL'); ?></th>
        <th><?= __d('admin-orderdrop', 'TRANSACTION_CODE'); ?></th>
        <th><?= __d('admin-orderdrop', 'TIMESTAMP'); ?></th>
        <th><?= __d('admin-orderdrop', 'VIEW_RAW'); ?></th>
    </tr>
    <?php foreach ($transactions as $transaction): ?>
        <tr>
            <td><?= $transaction['Transaction']['id']; ?></td>
            <td><?= $transaction['Transaction']['payment_module']; ?></td>
            <td><?= $transaction['Transaction']['successful']; ?></td>
            <td><?= $transaction['Transaction']['transaction_code']; ?></td>
            <td><?= $transaction['Transaction']['created']; ?></td>
            <td>
                <a href="<?= $this->Admin->dropinUrl('b839b495-33a6-4e69-b2bd-9132006f59bd', 'displayRawTransaction', [$transaction['Transaction']['id']]); ?>"><?= __d('admin-orderdrop', 'VIEW_RAW'); ?></a>
            </td>
        </tr>
    <?php endforeach; ?>
</table>
