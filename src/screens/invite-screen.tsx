import { IMAGES } from '@/assets'
import { ROUTES } from '@/core/lib/routes'
import AppScreenAuthLayout from '@/shared/components/AppScreenAuthLayout'

export default function InviteScreen() {
	return (
		<AppScreenAuthLayout
			sourceImg={IMAGES.InviteBG}
			title='Регистрация прошла успешно'
			titleBtn='перейти'
			subtitle='Давай познакомимся поближе. укажите ФИО, должность и подразделение'
			hrefBtn={ROUTES.PROFILE_FILL}
		/>
	)
}
