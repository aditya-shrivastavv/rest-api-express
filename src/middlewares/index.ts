import { NextFunction, Request, Response } from 'express'
import { merge } from 'lodash'

import { getUserBySessionToken } from '../db/user'

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const sessionToken = req.cookies['REST_AUTH']

		if (!sessionToken) {
			return res.sendStatus(403)
		}

		const existingUser = await getUserBySessionToken(sessionToken)

		if (!existingUser) {
			return res.sendStatus(403)
		}

		merge(req, { identity: existingUser })

		return next()
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}
