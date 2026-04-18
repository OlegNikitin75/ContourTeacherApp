import { IMAGES } from '@/assets'
import { ROUTES } from '@/core/lib/routes'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'

export default function IntroScreen() {
	return (
		<AppScreenAuthLayout
			sourceImg={IMAGES.IntroBG}
			title={'удобный помощник\nв вашем телефоне'}
			titleBtn='зарегистрироваться'
			bottomText='уже есть аккаунт?'
			bottomLinkText='войти'
			hrefBtn={ROUTES.ACCESS_CODE}
			hrefLink={ROUTES.SIGNIN}
		/>
	)
}
