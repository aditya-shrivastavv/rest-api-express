import { NextFunction, Request, Response } from 'express'
import { get, merge } from 'lodash'

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

		next()
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}

export const isOwner = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params
		const currentUserId = get(req, 'identity._id') as string

		if (!currentUserId) {
			return res.sendStatus(403)
		}

		if (currentUserId.toString() !== id) {
			return res.sendStatus(403)
		}

		next()
	} catch (error) {
		console.log(error)
		return res.sendStatus(400).json({
			success: false,
			message: 'Something went wrong!'
		})
	}
}
