'use strict';

const {describe, it} = require('mocha');
const {assert} = require('chai');

const factory = require('./testFactory');
const {pseudoRandomBuffer} = require('./testUtil');

describe('Group Definition', () => {
    before(async function() {
        this.timeout(15000);
        await factory.asyncLoad();
    });

    after(async function() {
        this.timeout(15000);
    });

    it('should FAIL to create', async () => {
        assert.throws(() => new factory.WitnessGroupDefinition());
    });

    it('should create', async () => {
        new factory.WitnessGroupDefinition({
            publicKeys: [pseudoRandomBuffer(33), pseudoRandomBuffer(33)],
            groupId: 10,
            quorum: 1,
            delegatesPublicKeys: [pseudoRandomBuffer(33), pseudoRandomBuffer(33)]
        });

        factory.WitnessGroupDefinition.create(
            10,
            [pseudoRandomBuffer(33), pseudoRandomBuffer(33)],
            [pseudoRandomBuffer(33), pseudoRandomBuffer(33)]
        );
    });

    it('should fill delegates if we omit them', async () => {
        {
            const def = new factory.WitnessGroupDefinition({
                publicKeys: [pseudoRandomBuffer(33), pseudoRandomBuffer(33)],
                groupId: 10
            });

            assert.isOk(Array.isArray(def.getDelegatesPublicKeys()));
        }
        {
            const def = factory.WitnessGroupDefinition.create(10, [pseudoRandomBuffer(33), pseudoRandomBuffer(33)]);

            assert.isOk(Array.isArray(def.getDelegatesPublicKeys()));
        }
    });

    it('should assign all participants as delegates', async () => {
        const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
        const def = factory.WitnessGroupDefinition.create(
            10,
            arrPubKeys
        );
        assert.isOk(Array.isArray(def.getDelegatesPublicKeys()));

        // it's a same array (not one by one comparision)
        assert.equal(def.getPublicKeys(), arrPubKeys);
        assert.equal(def.getDelegatesPublicKeys(), arrPubKeys);
    });

    it('should assign separate delegates', async () => {
        const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
        const arrDelegatesKeys = [arrPubKeys[0]];
        const def = factory.WitnessGroupDefinition.create(
            10,
            arrPubKeys,
            arrDelegatesKeys
        );
        assert.isOk(Array.isArray(def.getDelegatesPublicKeys()));

        // it's a same array (not one by one comparision)
        assert.equal(def.getPublicKeys(), arrPubKeys);
        assert.equal(def.getDelegatesPublicKeys(), arrDelegatesKeys);
    });

    it('should return quorum', async () => {
        {
            const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
            const arrDelegatesKeys = [arrPubKeys[0]];
            const def = factory.WitnessGroupDefinition.create(10, arrPubKeys, arrDelegatesKeys);

            // one delegate
            assert.equal(def.getQuorum(), 1);
        }
        {
            const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
            const def = factory.WitnessGroupDefinition.create(10, arrPubKeys);

            // two delegates from pubKeys
            assert.equal(def.getQuorum(), 2);
        }
        {
            const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
            const def = factory.WitnessGroupDefinition.create(10, arrPubKeys, undefined, 10);

            // manually specified
            assert.equal(def.getQuorum(), 10);
        }

        {
            const arrPubKeys = [pseudoRandomBuffer(33), pseudoRandomBuffer(33)];
            const def = factory.WitnessGroupDefinition.create(10, arrPubKeys);
            def.setQuorum(10);

            // manually specified
            assert.equal(def.getQuorum(), 10);
        }
    });
});
