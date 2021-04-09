<template>
	<div class="navbar">
		<hamburger
			id="hamburger-container"
			:is-active="sidebar.opened"
			class="hamburger-container"
			@toggle-click="toggleSideBar"
		/>

		<breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

		<div class="right-menu">
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<el-image class="icon user-avatar" :src="user.avatar" fit="cover">
						<template #error>
							<div class="image-slot">
								<svg-icon icon-class="defalut-header-img"></svg-icon>
							</div>
						</template>
					</el-image>
					<span class="nickname">{{ user.nickname }}</span>
					<i class="el-icon-arrow-down" />
				</div>
				<template #dropdown>
					<el-dropdown-menu class="user-dropdown">
						<router-link to="/">
							<el-dropdown-item> 首页 </el-dropdown-item>
						</router-link>
						<el-dropdown-item divided @click="logout">
							<span style="display: block">退出</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
	components: {
		Breadcrumb,
		Hamburger,
	},
	computed: {
		...mapGetters(['sidebar']),
		...mapState({
			user: state => state.user.loginData,
		}),
	},
	mounted() {
		console.log('state---------->', this.$store.state)
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch('app/toggleSideBar')
		},
		async logout() {
			await this.$store.dispatch('user/logout')
			this.$router.push(`/login?redirect=${this.$route.fullPath}`)
		},
	},
}
</script>

<style lang="scss">
.navbar {
	height: 72px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	.hamburger-container {
		line-height: 70px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.right-menu {
		float: right;
		height: 100%;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 12px;

				.el-image {
					vertical-align: middle;
				}
				.user-avatar {
					cursor: pointer;
					width: 48px;
					height: 48px;
					border-radius: 50%;
					vertical-align: middle;
					.image-slot .svg-icon {
						width: 48px;
						height: 48px;
					}
				}

				.nickname {
					margin-left: 6px;
					cursor: pointer;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
