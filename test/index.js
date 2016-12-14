const should = require('should');
const joi = require('joi');
const feathersJoi = require('../src');

describe('feathers-joi module test suite', () => {
    it('should export a feathers hook factory function', () => {
        feathersJoi.should.be.a.Function();
    });
    it('should return a feathers-joi schema validator hook function from factory function call', () => {
        const hook = feathersJoi({
            schema: joi.string().required()
        });

        hook.should.be.a.Function();
    });
    it('should accept valid data against a joi schema', done => {
        const hook = feathersJoi({
            schema: joi.string().required()
        });

        hook(
            {
                data: 'Bernie Sanders'
            } 
        ).then(() => done()).catch(); // succeed on validation or catch errors
    });
    it('should return a Promise from hook call', () => {
        const hook = feathersJoi({
            schema: joi.string().required()
        });

        hook({data: 'test'}).should.have.a.property('then').and.be.a.Function();
    });
    it('should reject invalid input data against a joi schema', done => {
        const schema = joi.number().required();
        const hook = feathersJoi({
            schema: schema
        });
        
        const input = {
            data: 'Donald Trump'
        };

        hook(input)
            .then(res => done(new Error('feathers-joi hook accepted bad input data', schema, schema)) )
            .catch(err => done()); // expect error
    });
});