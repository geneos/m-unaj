<div id="header-principal-1" class="clearfix">
		
        <?php echo $OUTPUT->course_header(); ?>
		<div class="container">
			<a href="http://www.unaj.edu.ar">
			<div id="logo-header-principal-1" class="clearfix"></div>
			</a>
			<div id="moodle-navbar-1">
			<?php if (isloggedin())  { ?>
				<ul class="nav pull-right infologeo">
					<?php global $USER; ?>
					<li><?php echo $OUTPUT->page_heading_menu(); ?></li>
					<?php $user_picture=new user_picture($USER); ?>
					<?php $src=$user_picture->get_url($PAGE); ?>
					<?php $src = str_replace("f2","f1",$src); ?>
					<li class="perfil-image"><img src="<?php echo $src; ?>"/></li>
					<li class="navbar-text">
						<?php //echo $OUTPUT->user_menu(); ?>
						<div class="textolog">
							   <span class="bienv">Bienvenido </span><a class="cerrar_sesion" href="<?php echo $CFG->httpswwwroot ?>/login/logout.php?sesskey=<?php echo $USER->sesskey; ?>">(Salir)</a><br>
							   <a href="/user/profile.php?id=<?php echo $USER->id; ?>"><?php echo $USER->firstname; ?>  
							   <?php echo $USER->lastname; ?></a><br>
					   </div>
				   </li>
				</ul>		
			<?php } ?>
			</div>	
		</div>		
</div>