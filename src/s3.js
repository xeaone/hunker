
//const Aws = require('aws-sdk');

export default {

	async setup (data) {
		data = data || {};

		const acl = data.acl || this.acl;
		const bucket = data.bucket || this.bucket;

		if (!bucket) throw new Error('bucket missing');

		try {
			return await this.s3.createBucket({
				ACL: acl,
				Bucket: bucket
			}).promise();
		} catch (error) {
			if (error.code !== 'BucketAlreadyOwnedByYou') {
				throw error;
			}
		}

	},

	async list (data) {
		if (!data.key) throw new Error('key missing');

		let result;

		try {
			result = await this.s3.listObjectsV2({
				MaxKeys: 1000,
				Prefix: data.key,
				Bucket: this.bucket,
				ContinuationToken: data.token
			}).promise();
		} catch (e) {
			if (e.code !== 'NoSuchBucket') {
				throw e;
			}
		}

		let body;

		if (result) {
			body = [];

			for (let content of result.Contents) {
				body.push(content);
			}

		}

		return {
			body: body,
			token: result.NextContinuationToken
		};
	},

	async has (data) {
		if (!data.key) throw new Error('key missing');

		try {
			const result = await this.s3.headObject({
				Key: data.key,
				Bucket: this.bucket
			}).promise();
		} catch (e) {
			if (e.code === 'NotFound') {
				return false
			} else {
				throw e;
			}
		}

		return true;
	},

	async remove (data) {
		if (!data.key) throw new Error('key missing');

		let result = null;

		try {
			result = await this.s3.deleteObject({
				Key: data.key,
				Bucket: this.bucket
			}).promise();
		} catch (e) {
			if (e.code !== 'NoSuchKey') {
				throw e;
			}
		}

		return result;
	},

	async get (data) {
		if (!data.key) throw new Error('key missing');

		let result;

		try {
			result = await this.s3.getObject({
				Key: data.key,
				Bucket: this.bucket
			}).promise();
		} catch (e) {
			if (e.code !== 'NoSuchKey') {
				throw e;
			}
		}

		let body;

		if (result) {
			const parse = data.parse === undefined ? this.parse : false;

			body = result.Body;

			// if (data.secret || this.secret && data.decrypt || this.decrypt) {
			// }

			if (parse) {
				body = JSON.parse(body);
			}

		}

		return body;
	},

	async set (data) {
		if (!data.key) throw new Error('key missing');
		if (!data.body) throw new Error('body missing');

		let body;

		if (data.stringify || this.stringify && typeof data.body === 'object') {
			body = JSON.stringify(data.body);
		} else {
			body = data.body;
		}

		const result = await this.s3.putObject({
			Body: body,
			Key: data.key,
			Bucket: this.bucket
		}).promise();

		return result;
	}

}

