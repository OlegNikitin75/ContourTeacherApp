import { IMAGES } from '@/assets'
import { ROUTES } from '@/core/lib/routes'
import AppScreenOnboardingLayout from '@/shared/components/AppScreenOnboardingLayout'

export default function IntroScreen() {
	return (
		<AppScreenOnboardingLayout
			sourceImg={IMAGES.IntroBG}
			title={'удобный помощник\nв вашем телефоне'}
			titleBtn='продолжить'
			hrefBtn={ROUTES.ACCESS_CODE}
		/>
	)
}
