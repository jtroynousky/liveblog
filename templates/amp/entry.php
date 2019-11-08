<?php
	$id             = $this->get( 'id' ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.OverrideProhibited
	$entry_time     = $this->get( 'time' );
	$content        = $this->get( 'content' );
	$social         = $this->get( 'social' );
	$single         = $this->get( 'single' );
	$share_link     = $this->get( 'share_link' );
	$update_time    = $this->get( 'update_time' );
	$share_link_amp = $this->get( 'share_link_amp' );
	$headline       = $this->get( 'headline' );
	$subtitle       = $this->get( 'subtitle' );
?>
<div class="liveblog-entry" id="post<?php echo esc_attr( $update_time ); ?>"
	data-sort-time="<?php echo esc_attr( $entry_time ); ?>">

	<aside class="liveblog-entry-aside">
		<a class="liveblog-meta-time" href="#" target="_blank">
			<span><?php echo esc_html( $this->get( 'time_ago' ) ); ?></span>
			<span><?php echo esc_html( $this->get( 'date' ) ); ?> </span>
		</a>
	</aside>

	<div class="liveblog-entry-main">
		<header class="liveblog-header">
			<?php if ( $headline || $subtitle) : ?>
			<div class="liveblog-entry-heading">
				<?php if ($headline) : ?>
				<h2 class="liveblog-entry-headline">
                  <?php echo esc_html( $headline) ?>
                </h2>
				<?php endif; ?>
				<?php if ($subtitle) : ?>
				<h3 class="liveblog-entry-subtitle">
                  <?php echo esc_html( $subtitle) ?>
                </h3>
				<?php endif; ?>
			</div>
			<?php endif; ?>
			<div class="liveblog-meta-authors">
				<?php if ( is_array( $this->get( 'authors' ) ) ) : ?>

					<?php foreach ( $this->get( 'authors' ) as $author ) : ?>

						<?php
						$this->load_part(
							'author',
							array(
								'author' => $author,
							)
						);
						?>

					<?php endforeach ?>


					<?php else : ?>

					<?php
					$this->load_part(
						'author',
						array(
							'author' => $authors,
						)
					);
					?>

				<?php endif; ?>
			</div>
		</header>

	

		<div class="liveblog-entry-content">
			<?php echo wp_kses_post( $this->get( 'content' ) ); ?>

			<?php if ( $single ) : ?>
				<a href="<?php echo esc_url( $share_link ); ?>">View in feed</a>
			<?php endif; ?>

			<?php if ( count( $social ) > 1 ) : ?>
				<?php foreach ( $social as $platform ) : ?>
				<amp-social-share type="<?php echo esc_attr( $platform ); ?>"
					width="45"
					height="33"
					data-param-url="<?php echo esc_url( $share_link_amp ); ?>"></amp-social-share>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	</div>
</div>
