import { ROUTES } from '@/lib/routes'
import AppScreenAuthLayout from '@/src/components/AppScreenAuthLayout'

export default function Intro() {
	return (
		<AppScreenAuthLayout
			sourceImg={require('../../../assets/images/appImages/intro_image.png')}
			title={'удобный помощник\nв вашем телефоне'}
			titleBtn='зарегистрироваться'
			bottomText='уже есть аккаунт?'
			bottomLinkText='войти'
			hrefBtn={ROUTES.ACCESS_CODE}
			hrefLink={ROUTES.SIGNIN}
		/>
	)
}
