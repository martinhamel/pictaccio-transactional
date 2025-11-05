<?php

?>

<section>
	<div class="container">
		<form method="post" action="<?= $this->Html->url(array('controller' => 'admin', 'action' => 'auth')); ?>" style="background-color: #eee; border: 1px #ddd solid; margin: 0 auto; text-align: center; width: 500px; padding: 16px;">
			<label>Auth code:</label>
			<input type="password" name="authkey">
			<input type="submit">
		</form>
	</div>
</section>
